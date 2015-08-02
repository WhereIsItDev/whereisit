# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"

  # config.vm.network "forwarded_port", guest: 80, host: 8080

  config.vm.provider "virtualbox" do |vb|
    # Customize the amount of memory on the VM:
    vb.memory = "2048"
  end

  config.vm.provision "shell", inline: <<-SHELL
    sudo apt-get update
    sudo apt-get install -y git nodejs npm exuberant-ctags python-pip
    sudo pip install virtualenvwrapper
    source /usr/local/bin/virtualenvwrapper.sh
    mkvirtualenv whereisit
    workon whereisit
    pip install -r tags-parser/requirements.txt
  SHELL
end
